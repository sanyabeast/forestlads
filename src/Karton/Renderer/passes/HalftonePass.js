/**
 * @author meatbags / xavierburrow.com, github/meatbags
 *
 * RGB Halftone pass for three.js effects composer. Requires HalfToneShader.
 *
 */

import * as THREE from "three"
import Pass from "Karton/Renderer/Pass"
import HalfToneShader from "Karton/Renderer/shaders/HalftoneShader"


class HalftonePass extends Pass {
	constructor ( width, height, params ) {

		super()

	 	if ( HalfToneShader === undefined ) {

	 		console.error( 'THREE.HalftonePass requires HalfToneShader' );

	 	}

	 	this.uniforms = THREE.UniformsUtils.clone( HalfToneShader.uniforms );
	 	this.material = new THREE.ShaderMaterial( {
	 		uniforms: this.uniforms,
	 		fragmentShader: HalfToneShader.fragmentShader,
	 		vertexShader: HalfToneShader.vertexShader
	 	} );

		// set params
		this.uniforms.width.value = width;
		this.uniforms.height.value = height;

		for ( var key in params ) {

			if ( params.hasOwnProperty( key ) && this.uniforms.hasOwnProperty( key ) ) {

				this.uniforms[key].value = params[key];

			}

		}

	 	this.camera = new THREE.OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );
	 	this.scene = new THREE.Scene();
	 	this.quad = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2, 2 ), null );
	 	this.quad.frustumCulled = false;
	 	this.scene.add( this.quad );

	 }

	render ( renderer, writeBuffer, readBuffer, deltaTime, maskActive ) {

 		this.material.uniforms[ "tDiffuse" ].value = readBuffer.texture;
 		this.quad.material = this.material;

 		if ( this.renderToScreen ) {

 			renderer.render( this.scene, this.camera );

		} else {

			renderer.render( this.scene, this.camera, writeBuffer, this.clear );

		}

 	}

 	setSize ( width, height ) {

 		this.uniforms.width.value = width;
 		this.uniforms.height.value = height;

 	}
}

export default HalftonePass