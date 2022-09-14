import "./App.css";
import * as tf from "@tensorflow/tfjs";
import { useDataset } from "./lib/dataset";
import { useModel } from "./lib/model";
import { useEffect, useState } from "react";

function App() {
  const { dataset, loading: datasetLoading } = useDataset(true);
  const { model, loading: modelLoading } = useModel("neuraljs");
  const [accuracy, setAccuracy] = useState<number | undefined>();

  useEffect(() => {
    if (dataset && model) {
      tf.tidy(() => {
        const predLogits = model.predict(dataset.x) as tf.Tensor<tf.Rank>;
        const crossentropy = tf.metrics.sparseCategoricalAccuracy(
          dataset!.y,
          predLogits
        );
        const sum = crossentropy.sum().dataSync();
        const size = crossentropy.size;

        setAccuracy((sum[0] / size) * 100);
      });
    }
  }, [dataset, model]);

  if (datasetLoading || modelLoading || !accuracy) {
    return <div>Loading</div>;
  }

  return <div>Accuracy: {accuracy}%</div>;
}

export default App;
