import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { gsap } from 'gsap'

import vertex from './shaders/vertex.vs.glsl'
import fragment from './shaders/fragment.fs.glsl'

export default class Sketch {
  constructor() {
    this.time = 0;
    this.clock = new THREE.Clock();
    this.camera = new THREE.PerspectiveCamera( 75, 2, 0.1, 1000 );
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({ antialias:true });
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.setup();
    this.createWorld();
    this.render();
  }

  setup() {
    this.camera.position.z = 8;
    this.renderer.setClearColor(0xf1faee);
    document.getElementById('container').appendChild(this.renderer.domElement)
    window.addEventListener('resize', () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      this.camera.aspect = w / h
      this.camera.updateProjectionMatrix();
      this.renderer.setSize( w, h );
      this.renderer.setPixelRatio(window.devicePixelRatio);
    });
    window.addEventListener('mousemove', (e) => {
      const x = e.clientX / window.innerWidth * 2 - 1;
      const y = e.clientY / window.innerHeight * 2 - 1;

      gsap.to(this.camera.position, {
        x: () => x * 0.5,
        y: () => y * 0.2,
        duration: 0.5
      })
    })
    window.dispatchEvent(new Event('resize'));
  }

  createWorld() {
    this.geometry = new THREE.BoxGeometry( 5, 5, 5, 10, 10, 10);
    this.material = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms: {
        uProgress: { type: "f", value: 0 },
        uTime: { type: "f", value: 0 }
      },
      side: THREE.DoubleSide,
      wireframe: true
    });
    this.mesh = new THREE.Points( this.geometry, this.material )
    this.scene.add( this.mesh );
  }

  render() {
    this.time = this.clock.getElapsedTime();
    this.material.uniforms.uTime.value = this.time;
    this.camera.lookAt(0, 0, 0);
    this.controls.update();
    this.renderer.render( this.scene, this.camera )
    window.requestAnimationFrame(this.render.bind(this));
  }
}

const sketch = new Sketch();