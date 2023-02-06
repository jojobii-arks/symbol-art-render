import {Application, Assets, Container, ITypedArray, SimplePlane, Texture} from 'pixi.js';
import type SymbolArtInterface from 'symbol-art-parser/dist/interfaces/SymbolArtInterface';

function colorToHex(color: number) {
  const hexadecimal = color.toString(16);
  return hexadecimal.length === 1 ? '0' + hexadecimal : hexadecimal;
}

function convertRGBtoHex(red:number, green: number, blue: number) {
  return parseInt('0x' + colorToHex(red) + colorToHex(green) + colorToHex(blue));
}

export default async function renderSar(sar: SymbolArtInterface) {
  const spritesheet = await Assets.load('/spritesheet.json')
  const app = new Application({
    width: 760,
    height: 380,
    antialias: true,
    preserveDrawingBuffer: true,
    autoDensity: true,
    backgroundAlpha: 0,
    clearBeforeRender: true
  });
  const resolution = 4;
  const container = new Container();
  app.stage.addChild(container);
  const offsetX = -126;
  const offsetY = -317;
  const layers = sar.layers.reverse();

  for (let i = 0; i < layers.length; i++) {
    const layer = layers[i];
    const layerPath = `${layer.symbol + 1}.png`;
    const corners = [
      {
        x: layer.position.topLeft.x * resolution + offsetX,
        y: layer.position.topLeft.y * resolution + offsetY
      },
      {
        x: layer.position.topRight.x * resolution + offsetX,
        y: layer.position.topRight.y * resolution + offsetY
      },
      {
        x: layer.position.bottomLeft.x * resolution + offsetX,
        y: layer.position.bottomLeft.y * resolution + offsetY
      },
      {
        x: layer.position.bottomRight.x * resolution + offsetX,
        y: layer.position.bottomRight.y * resolution + offsetY
      },
    ];
    const { r, g, b, a, isVisible } = layer;

    let trueAlpha = a / 7;
    if (!isVisible) trueAlpha = 0;

    const trueR = r * 4;
    const trueG = g * 4;
    const trueB = b * 4;

    const hex = convertRGBtoHex(trueR, trueG, trueB);
    console.log(corners.map(e => [e.x, e.y]).flat());

    console.log(spritesheet.textures[layerPath]);
    const sprite = new SimplePlane(spritesheet.textures[layerPath], 2, 2);
    sprite.tint = hex;
    sprite.alpha = trueAlpha;
    const buffer = sprite.geometry.getBuffer('aVertexPosition');
    buffer.data = corners.map(e => [e.x, e.y]).flat() as unknown as ITypedArray;
    container.addChild(sprite);
  }
  if (app.view.toDataURL) (console.log(app.view.toDataURL()))

 await new Promise(resolve => {
    app.renderer.addListener('postrender', () => {
      console.log(app.view.toDataURL());
      if (app.view.toDataURL) {
        resolve(app.view.toDataURL());
      }
      else return;
    })
  })

}

// export default function renderSar(sar: SymbolArt) {
// 	const promise = new Promise(resolve => {
// 		PIXI.utils.destroyTextureCache();
// 		const app = new PIXI.Application({
// 			width: 760,
// 			height: 380,
// 			antialias: true,
// 			preserveDrawingBuffer: true,
// 			autoDensity: true,
// 			backgroundAlpha: 0,
// 			clearBeforeRender: true
// 		});

// 		const resolution = 4;

// 		app.loader.add('spritesheet', '../spritesheet.json').load(() => {
// 			const container = new PIXI.Container();
// 			app.stage.addChild(container);

// 			const spritesheet = app.loader.resources.spritesheet;

// 			const layers = [...sar.layers].reverse();

// 			const offsetX = -126;
// 			const offsetY = -317;

// 			for (let i = 0; i < layers.length; i++) {
// 				const layer = layers[i];
// 				const layerPath = `${layer.props.textureIndex + 1}.png`;
// 				const corners = [
// 					{
// 						x: layer.points.topLeft.x * resolution + offsetX,
// 						y: layer.points.topLeft.y * resolution + offsetY
// 					},
// 					{
// 						x: layer.points.topRight.x * resolution + offsetX,
// 						y: layer.points.topRight.y * resolution + offsetY
// 					},
// 					{
// 						x: layer.points.bottomRight.x * resolution + offsetX,
// 						y: layer.points.bottomRight.y * resolution + offsetY
// 					},
// 					{
// 						x: layer.points.bottomLeft.x * resolution + offsetX,
// 						y: layer.points.bottomLeft.y * resolution + offsetY
// 					}
// 				];
// 				const { props } = layer;
// 				const { colorR, colorG, colorB, transparency, visible } = props;

// 				let trueAlpha = transparency / 7;
// 				if (!visible) trueAlpha = 0;

// 				const trueR = colorR * 4;
// 				const trueG = colorG * 4;
// 				const trueB = colorB * 4;

// 				const hex = convertRGBtoHex(trueR, trueG, trueB);

// 				const sprite = new Sprite2d(spritesheet.textures[layerPath]);
// 				sprite.anchor.set(0.5);
// 				sprite.tint = hex;
// 				sprite.alpha = trueAlpha;
// 				sprite.proj.mapSprite(sprite, corners);

// 				container.addChild(sprite);
// 			}
// 			app.renderer.addListener('postrender', () => {
// 				resolve(app.view.toDataURL());
// 				app.destroy();
// 			});
// 		});
// 	});

// 	return promise;
// }