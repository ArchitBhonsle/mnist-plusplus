import * as tf from "@tensorflow/tfjs";
import { useEffect, useState } from "react";

const fetchModel = async (name: string) => {
  const url = `data/${name}/model.json`;
  const model = await tf.loadGraphModel(url, {
    requestInit: { cache: "no-cache" },
  });
  return model;
};

type ModelState = {
  model: tf.GraphModel | undefined;
  loading: boolean;
};

export const useModel = (name: string) => {
  const [datasetState, setDatasetState] = useState<ModelState>({
    model: undefined,
    loading: true,
  });

  useEffect(() => {
    (async () => {
      const model = await fetchModel(name);
      setDatasetState({
        model,
        loading: false,
      });
    })();
  }, []);

  return datasetState;
};
