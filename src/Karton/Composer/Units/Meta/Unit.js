import { Group, SpriteMaterial, Sprite } from "three"
import { forEach } from "lodash"
import Units from "Karton/Units"
import Textures from "Karton/Textures"
import Helpers from "Karton/Helpers"
import tweener from "tweener"

class Unit {
	composer = null;
	description = null;
	elements = null;
	tags = null;
	params = null;

	get position () {
		return this.elements.position
	}

	get rotation () {
		return this.elements.rotation
	}

	constructor (composer, description) {
		this.composer = composer;
		this.description = description;

		this.tags = []
		this.params = {};

		if (description.tags){
			this.setTags(description.tags);
		}

		if (description.params){
			this.setParams(description.params);
		}

		if (description.elements){
			this.elements = this.composeElements(description.elements)
		}

	}

	composeElements (description) {
		let elements = new Group()
		return elements
	}

	setTags (tags) {
		forEach(tags, (tag)=>{
			this.tags.push(tag)
		})
	}

	setParams (params){
		forEach(params, (value, key)=>{
			this.params[key] = value
		})
	}

	createObject3D (type, description) {

	}

	clone () {
		let clone = new this.constructor(this.composer, this.description)
		return clone
	}

	createSprite (description) {
		let texture = this.getSomeTexture(description.texture)

		var spriteMaterial = new SpriteMaterial( { map: texture, color: 0xffffff, transparent: true } );

		var sprite = new Sprite( spriteMaterial );

		if (description.scale){
			let fuzzFactor = description.scale.fuzz
			let scale = this.fuzz(description.scale.x, fuzzFactor);

			sprite.scale.set(sprite.scale.x* scale, sprite.scale.y * scale,1)
			
		}

		sprite.center.y = 0

		if (description.texture == "tree"){
		} else if (description.texture == "kitty"){
			tweener.fromTo(sprite.position, 0.2 + (Math.random() * 0.2), {
				y: 0
			}, {
				y: 0.08,
				repeat: -1,
				yoyo: true,
				ease: "easeOutQuad"
			})
		}

		if (description.shadow === 1){
			this.createShadowSprite(sprite)
		}

		return sprite;
	}

	createShadowSprite (sprite) {
		return sprite
		let shadow = this.createSprite({
			texture: "shadow_1",
			shadow: 0
		})

		// shadow.position.y = {
		// 	valueOf : function(){
		// 		return -sprite.position.y -0.5
		// 	}
		// }
		shadow.material.opacity = 0.05
		shadow.scale.set(5, 5, 5)
		// shadow.geometry.translate(0, 1, 0)

		// debugger;

		shadow.position.y = 0
		shadow.position.z =0
		
		let group = new THREE.Group()
		group.add(sprite)
		group.add(shadow)

		console.log(group)

		return group;
	}

	setElementPosition (element, x, y) {
		element.position.set(x - 32, element.position.y, y - 32)
	}

	getFuzz (fuzzFactor) {
		return ((Math.random() * fuzzFactor) - (fuzzFactor / 2)) || 0;
	}

	fuzz(value, fuzzFactor) {
		return value + (((Math.random() * fuzzFactor) - (fuzzFactor / 2)) || 0)
	}

	getSomeTexture (regexp){
		return Helpers.randValueFromObject(Helpers.filerObjectByRegExp(Textures, regexp))
	}

	setTextureRepeat (texture, config){
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set( config.x || config, config.y || config );
	}
}

export default Unit