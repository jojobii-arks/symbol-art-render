import SymbolArt from "symbol-art-parser";
import { useCallback, useState } from "react";
import renderSar from "../lib/renderSar";

export default function () {
  const [src, setSrc] = useState<string | null>(null);

  const readFile = useCallback(async (files: HTMLInputElement["files"]) => {
    if (!files) return;
    if (files[0]) {
      const file = files[0];
      const sar = new SymbolArt();
      sar.data = await file.arrayBuffer();
      console.log(sar.json);
      const x = await renderSar(sar.json);
      console.log(x);
      setSrc(x);
    }
  }, []);

  return (
    <>
      <main className="p-8">
        <h1 className="mb-2 text-4xl font-semibold">Symbol Art Renderer</h1>
        <h2 className="mb-4 text-2xl hover:underline">
          <a
            className="text-blue-800"
            href="https://github.com/jojobii-arks/symbol-art-render"
          >
            View Repository
          </a>
        </h2>
        <p>
          <label htmlFor="symbolfile">
            Load <code>.sar</code> file here:
          </label>
        </p>
        <input
          type="file"
          name="symbolfile"
          id="symbolfile"
          accept=".sar"
          onChange={(e) => {
            readFile(e.target.files);
          }}
        />
        <hr className="my-4" />
        {src ? (
          <img className="shadow-md" src={src} alt="" />
        ) : (
          <>Nothing has been rendered yet.</>
        )}
      </main>
    </>
  );
}
