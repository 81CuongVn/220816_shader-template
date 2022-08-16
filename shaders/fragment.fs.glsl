uniform float uTime;

void main() {
  gl_FragColor = vec4(abs(sin(.2 * uTime*5.0)), .56, .44, 1.);
}