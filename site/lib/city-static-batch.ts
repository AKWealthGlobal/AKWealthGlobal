import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

type Candidate = { mesh: THREE.Mesh; matrix: THREE.Matrix4 };

/** Combine only opaque, static board pieces. Character hierarchies must stay separate. */
export function batchCityGeometry(root: THREE.Object3D): { before: number; after: number } {
  root.updateWorldMatrix(true, true);
  const inverseRoot = root.matrixWorld.clone().invert();
  const buckets = new Map<string, Candidate[]>();
  const originals = new Set<THREE.BufferGeometry>();
  let before = 0;

  root.traverse(object => {
    if (!(object instanceof THREE.Mesh)) return;
    before += 1;
    const mesh = object;
    const geometry = mesh.geometry;
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    const matrix = new THREE.Matrix4().multiplyMatrices(inverseRoot, mesh.matrixWorld);
    // Keep dynamic geometry, mirrored transforms and transparent sorting intact.
    if (mesh instanceof THREE.SkinnedMesh || mesh instanceof THREE.InstancedMesh ||
      mesh.children.length || Object.keys(geometry.morphAttributes).length ||
      !geometry.getAttribute('position') || matrix.determinant() <= 1e-10 ||
      geometry.drawRange.start !== 0 || geometry.drawRange.count !== Infinity ||
      mesh.customDepthMaterial || mesh.customDistanceMaterial ||
      materials.some(material => material.transparent || material.opacity < 1 ||
        (material instanceof THREE.MeshPhysicalMaterial && material.transmission > 0)) ||
      (Array.isArray(mesh.material) && !geometry.groups.length)) return;

    // Moving a hidden subtree or an independently ordered group to the root changes it.
    for (let ancestor: THREE.Object3D | null = mesh; ancestor && ancestor !== root; ancestor = ancestor.parent) {
      if (!ancestor.visible || (ancestor instanceof THREE.Group && ancestor.renderOrder !== 0)) return;
    }

    const attributes = Object.keys(geometry.attributes).sort();
    if (attributes.some(name => !(geometry.getAttribute(name) instanceof THREE.BufferAttribute))) return;
    const signature = attributes.map(name => {
      const attribute = geometry.getAttribute(name) as THREE.BufferAttribute;
      return `${name}:${attribute.array.constructor.name}:${attribute.itemSize}:${attribute.normalized}:${attribute.gpuType}`;
    }).join('|');
    const key = [
      Array.isArray(mesh.material) ? 'array' : 'single',
      materials.map(material => material.uuid).join(','),
      geometry.index ? 'indexed' : 'non-indexed', signature,
      mesh.castShadow, mesh.receiveShadow, mesh.frustumCulled, mesh.layers.mask, mesh.renderOrder,
    ].join(';');
    const bucket = buckets.get(key) ?? [];
    bucket.push({ mesh, matrix });
    buckets.set(key, bucket);
  });

  for (const candidates of buckets.values()) {
    if (candidates.length < 2) continue;
    const geometries: THREE.BufferGeometry[] = [];
    let merged: THREE.BufferGeometry | null = null;
    try {
      for (const { mesh, matrix } of candidates) {
        const geometry = mesh.geometry.clone();
        geometries.push(geometry);
        geometry.applyMatrix4(matrix);
      }
      merged = mergeGeometries(geometries, false);
      if (!merged) continue;

      // BufferGeometryUtils does not retain source groups when useGroups is false.
      // Preserve every range/material index, including intentionally omitted ranges.
      let offset = 0;
      for (const geometry of geometries) {
        for (const group of geometry.groups) {
          merged.addGroup(offset + group.start, group.count, group.materialIndex);
        }
        offset += geometry.index?.count ?? geometry.getAttribute('position').count;
      }
      merged.computeBoundingBox();
      merged.computeBoundingSphere();
      const exemplar = candidates[0].mesh;
      const mesh = new THREE.Mesh(merged, exemplar.material);
      mesh.name = `CityBatch_${Array.isArray(exemplar.material) ? exemplar.material[0].name : exemplar.material.name}`;
      mesh.castShadow = exemplar.castShadow;
      mesh.receiveShadow = exemplar.receiveShadow;
      mesh.frustumCulled = exemplar.frustumCulled;
      mesh.layers.mask = exemplar.layers.mask;
      mesh.renderOrder = exemplar.renderOrder;
      mesh.userData.sourceMeshes = candidates.map(candidate => candidate.mesh.name);
      root.add(mesh);
      for (const candidate of candidates) {
        originals.add(candidate.mesh.geometry);
        candidate.mesh.removeFromParent();
      }
      merged = null; // The new mesh now owns its geometry.
    } finally {
      geometries.forEach(geometry => geometry.dispose());
      merged?.dispose();
    }
  }

  // A source geometry may be shared with an unbatched mesh in this asset.
  const retained = new Set<THREE.BufferGeometry>();
  let after = 0;
  root.traverse(object => {
    if (object instanceof THREE.Mesh) {
      after += 1;
      retained.add(object.geometry);
    }
  });
  originals.forEach(geometry => { if (!retained.has(geometry)) geometry.dispose(); });
  const stats = { before, after };
  root.userData.cityBatch = stats;
  return stats;
}
