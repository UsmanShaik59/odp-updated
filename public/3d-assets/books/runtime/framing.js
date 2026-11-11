/** Measure in the neutral frame, then fit the current presentation pose. */
export function frameBook({presentation, content, root, box, center, size, pitch, yaw}) {
  presentation.rotation.set(0, 0, 0);
  content.position.set(0, 0, 0);
  // Box3 updates descendants, but does not refresh their ancestors. Never
  // feed the previous frame's centering or rotation into the next bounds.
  presentation.updateWorldMatrix(true, true);
  box.setFromObject(root).getCenter(center);
  content.position.copy(center).multiplyScalar(-1);
  presentation.rotation.set(pitch, yaw, 0);
  presentation.updateWorldMatrix(true, true);
  box.setFromObject(presentation).getSize(size);
}
