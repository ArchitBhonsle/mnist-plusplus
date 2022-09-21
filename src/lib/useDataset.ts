import * as tf from "@tensorflow/tfjs";
import { useEffect, useState } from "react";

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

const fetchDataset = async (test: boolean) => {
  const type = test ? "test" : "train";
  const x = await fetchRawData(`${type}_x`);
  const y = await fetchRawData(`${type}_y`);

  const xLength = x.length / (28 * 28);

  const xTensor = tf.tensor4d(x, [xLength, 28, 28, 1], "float32").div(255);
  const yTensor = tf.tensor1d(y, "int32");

  return { x: xTensor, y: yTensor } as Dataset;
};

type DatasetState = {
  dataset: Dataset | undefined;
  loading: boolean;
};

export const useDataset = (test: boolean) => {
  const [datasetState, setDatasetState] = useState<DatasetState>({
    dataset: undefined,
    loading: true,
  });

  useEffect(() => {
    (async () => {
      const ds = await fetchDataset(test);
      setDatasetState({
        dataset: ds,
        loading: false,
      });
    })();
  }, []);

  return datasetState;
};
