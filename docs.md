```
const app = new PIXI.Application({ background: '#1099bb' });
document.body.appendChild(app.view);

PIXI.Assets.load('examples/assets/bg_grass.jpg').then((texture) => {
    const plane = new PIXI.SimplePlane(texture , 2, 2);
    app.stage.addChild(plane);

    // Get the buffer for vertice positions.
 	const buffer = plane.geometry.getBuffer('aVertexPosition');
    console.dir(buffer.data);
  	buffer.data = [
  256, 342, 228,
  400, 188, 312,
  160, 370
]
});
```