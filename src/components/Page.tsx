import SymbolArt from 'symbol-art-parser';
import { useCallback, useState } from "react"

export default function () {
  const readFile = useCallback(async (files: HTMLInputElement['files']) => {
    if (!files) return;
    if (files[0]) {
      const file = files[0];
      const sar = new SymbolArt();
      sar.data = await file.arrayBuffer();
      console.log(sar.json);
    }
  }, [])
  return <>
    <input type="file" name="sar" id="sar" accept='.sar' onChange={(e) => readFile(e.target.files)} />   
  </>
}