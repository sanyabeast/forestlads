import * as THREE from "three"

export default {

	uniforms: {

		"tDiffuse": { value: null },
		"resolution": { value: new THREE.Vector2() }

	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

		"	vUv = uv;",
		"	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join( "\n" ),

	fragmentShader: [

		"uniform sampler2D tDiffuse;",

		"uniform vec2 resolution;",

		"varying vec2 vUv;",

		"void main() {",

		"	vec2 texelSize = ( 1.0 / resolution );",
		"	float result = 0.0;",

		"	for ( int i = - 2; i <= 2; i ++ ) {",

		"		for ( int j = - 2; j <= 2; j ++ ) {",

		"			vec2 offset = ( vec2( float( i ), float( j ) ) ) * texelSize;",
		"			result += texture2D( tDiffuse, vUv + offset ).r;",

		"		}",

		"	}",

		"	gl_FragColor = vec4( vec3( result / ( 5.0 * 5.0 ) ), 1.0 );",

		"}"

	].join( "\n" )

};
