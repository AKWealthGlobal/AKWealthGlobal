import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { SSAOPass } from 'three/addons/postprocessing/SSAOPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/addons/shaders/FXAAShader.js';

/** Optional screen-space contact shading. Direct rendering remains available. */
export function createCityEffects(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
  let composer: EffectComposer | undefined;
  let ao: SSAOPass | undefined;
  let antialias: ShaderPass | undefined;
  let detailed = false;
  let width = 1, height = 1;
  const previousShadowUpdate = renderer.shadowMap.autoUpdate;
  renderer.shadowMap.autoUpdate = false;
  const supported = Boolean(renderer.getContext().getExtension('EXT_color_buffer_float'));

  const resize = (w: number, h: number) => {
    width = w; height = h;
    // Bound the AO buffers independently of device DPR on high-density screens.
    const ratio = Math.min(renderer.getPixelRatio(), 1.25);
    composer?.setPixelRatio(ratio);
    composer?.setSize(w, h);
    antialias?.uniforms.resolution.value.set(1 / (w * ratio), 1 / (h * ratio));
  };
  const disposeComposer = () => {
    // SSAOPass currently leaves these two owned resources out of its dispose().
    ao?.ssaoMaterial.dispose();
    ao?.noiseTexture?.dispose();
    composer?.passes.forEach(pass => pass.dispose());
    composer?.dispose();
    composer = undefined; ao = undefined; antialias = undefined;
  };
  const setQuality = (requested: boolean) => {
    detailed = requested && supported;
    if (detailed && !composer) {
      try {
        composer = new EffectComposer(renderer);
        composer.addPass(new RenderPass(scene, camera));
        ao = new SSAOPass(scene, camera, width, height, 12);
        ao.kernelRadius = .55;
        ao.minDistance = .00015;
        ao.maxDistance = .015;
        composer.addPass(ao);
        composer.addPass(new OutputPass());
        antialias = new ShaderPass(FXAAShader);
        composer.addPass(antialias);
        resize(width, height);
      } catch {
        disposeComposer(); detailed = false;
      }
    }
    if (!detailed) disposeComposer();
    return detailed;
  };
  return {
    resize, setQuality,
    render() {
      renderer.info.reset();
      // One shadow update serves both the colour and the AO normal pass.
      renderer.shadowMap.needsUpdate = true;
      if (detailed && composer) composer.render();
      else renderer.render(scene, camera);
    },
    dispose() {disposeComposer();renderer.shadowMap.autoUpdate=previousShadowUpdate;},
  };
}
