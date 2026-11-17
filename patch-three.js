const fs = require('fs');

const files = [
  'node_modules/three/build/three.module.js',
  'node_modules/three/build/three.cjs',
  'node_modules/three/build/three.js',
  'node_modules/three/src/renderers/webgl/WebGLProgram.js',
];

files.forEach((f) => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    const target = 'const errors = gl.getShaderInfoLog( shader ).trim();';
    const replacement = 'const errors = ( gl.getShaderInfoLog( shader ) || "" ).trim();';
    if (content.includes(target)) {
      content = content.split(target).join(replacement);
      fs.writeFileSync(f, content, 'utf8');
      console.log('Patched:', f);
    } else {
      console.log('Already patched or not found in:', f);
    }
  }
});
