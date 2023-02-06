import {
  Application,
  Assets,
  Container,
  ITypedArray,
  SimplePlane,
} from "pixi.js";
import type SymbolArtInterface from "symbol-art-parser/dist/interfaces/SymbolArtInterface";

/** Turn RGB value into Hexadecimal format for `Mesh.tint` value */
function convertRGBtoHex(red: number, green: number, blue: number) {
  function colorToHex(color: number) {
    const hexadecimal = color.toString(16);
    return hexadecimal.length === 1 ? "0" + hexadecimal : hexadecimal;
  }
  return parseInt(
    "0x" + colorToHex(red) + colorToHex(green) + colorToHex(blue)
  );
}

/**
 * Use PixiJS to render a Symbol Art provided the `.sar` data as JSON.
 * @param sar - Symbol Art to render.
 * @param resolution - Rendering multiplier. Base resolution is `190px by 95px`. Defaults to `4`
 * @returns DataURL of the rendered Symbol Art.
 */
export default async function renderSar(
  sar: SymbolArtInterface,
  resolution: number = 4
) {
  const spritesheet = await Assets.load("/spritesheet.json");

  /** Top level container for rendering Symbol Art */
  const app = new Application({
    width: 190 * resolution,
    height: 95 * resolution,
    antialias: true,
    preserveDrawingBuffer: true,
    autoDensity: true,
    backgroundAlpha: 0,
    clearBeforeRender: true,
  });

  /** Rendering container for Symbol Art nested within `app` */
  const container = new Container();
  app.stage.addChild(container);

  // Add offsets to recenter symbol when calculating corners (eyeball estimate).
  const offsetX = -31.5 * resolution;
  const offsetY = -79.25 * resolution;

  // Reverse layers to render from back to front.
  const layers = sar.layers.reverse();

  for (let i = 0; i < layers.length; i++) {
    const layer = layers[i];
    const layerPath = `${layer.symbol + 1}.png`;
    const corners = [
      {
        x: layer.position.topLeft.x * resolution + offsetX,
        y: layer.position.topLeft.y * resolution + offsetY,
      },
      {
        x: layer.position.topRight.x * resolution + offsetX,
        y: layer.position.topRight.y * resolution + offsetY,
      },
      {
        x: layer.position.bottomLeft.x * resolution + offsetX,
        y: layer.position.bottomLeft.y * resolution + offsetY,
      },
      {
        x: layer.position.bottomRight.x * resolution + offsetX,
        y: layer.position.bottomRight.y * resolution + offsetY,
      },
    ];
    const { r, g, b, a, isVisible } = layer;

    let trueAlpha = a / 7;
    if (!isVisible) trueAlpha = 0;

    const trueR = r * 4;
    const trueG = g * 4;
    const trueB = b * 4;

    const hex = convertRGBtoHex(trueR, trueG, trueB);

    const sprite = new SimplePlane(spritesheet.textures[layerPath], 2, 2);
    sprite.tint = hex;
    sprite.alpha = trueAlpha;
    const buffer = sprite.geometry.getBuffer("aVertexPosition");
    buffer.data = corners
      .map((e) => [e.x, e.y])
      .flat() as unknown as ITypedArray;
    container.addChild(sprite);
  }

  // Wait for render to finish, then return the result.
  const result = await new Promise((resolve, reject) => {
    app.renderer.addListener("postrender", () => {
      if (app.view.toDataURL) {
        const x = app.view.toDataURL();
        resolve(x);
        app.destroy();
      } else {
        resolve(null);
      }
    });
  });
  if (result === null)
    throw Error(
      "Something went wrong when attempting to render the Symbol Art..."
    );
  return result as string;
}
