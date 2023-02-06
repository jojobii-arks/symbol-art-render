import SymbolArt from 'symbol-art-parser';
import { useCallback, useState } from "react"
import renderSar from '../lib/renderSar';

export default function () {

  const readFile = useCallback(async (files: HTMLInputElement['files']) => {
    if (!files) return;
    if (files[0]) {
      const file = files[0];
      const sar = new SymbolArt();
      sar.data = await file.arrayBuffer();
      console.log(sar.json);
      const x =  await renderSar(sar.json);
      console.log(x)
    }
  }, [])
  return <>
    <input type="file" name="sar" id="sar" accept='.sar' onChange={(e) => readFile(e.target.files)} />   
  </>
}