import * as tf from "@tensorflow/tfjs";

type Dataset = {
  x: tf.Tensor;
  y: tf.Tensor;
};

const fetchRawData = async (name: string) => {
  const resp = await fetch(`data/${name}`, { cache: "force-cache" });
  const buffer = await resp.arrayBuffer();
  const array = new Uint8Array(buffer);

  return array;
};

export const fetchDataset = async (test: boolean) => {
  const type = test ? "test" : "train";
  const x = await fetchRawData(`${type}_x`);
  const y = await fetchRawData(`${type}_y`);

  const xLength = x.length / (28 * 28);

  const xTensor = tf.tensor3d(x, [xLength, 28, 28], "float32");
  const yTensor = tf.tensor1d(y, "int32");

  return { x: xTensor, y: yTensor } as Dataset;
};
