import { useLayoutEffect, useRef } from "react";

type Props = {
  setImageData: (imageData: ImageData | null) => void;
};

export const Canvas = ({ setImageData }: Props) => {
  const canvas = useRef<HTMLCanvasElement>(null);
  let x: number | undefined,
    y: number | undefined,
    draw = false;

  useLayoutEffect(() => {
    if (canvas.current) {
      const min = Math.max(canvas.current.height, canvas.current.width);
      canvas.current.height = min;
      canvas.current.width = min;
    }
  }, [canvas]);

  const getPosition = (e: React.MouseEvent | React.TouchEvent) => {
    x =
      e.type == "touchmove"
        ? (e as React.TouchEvent).touches[0].clientX
        : (e as React.MouseEvent).clientX;
    y =
      e.type == "touchmove"
        ? (e as React.TouchEvent).touches[0].clientY
        : (e as React.MouseEvent).clientY;

    x =
      (x - canvas.current!.offsetLeft) *
      (canvas.current!.width / canvas.current!.clientWidth);
    y =
      (y - canvas.current!.offsetTop) *
      (canvas.current!.height / canvas.current!.clientHeight);
  };

  const start = (e: React.MouseEvent | React.TouchEvent) => {
    draw = true;
    getPosition(e);
  };

  const end = (_e: React.MouseEvent | React.TouchEvent) => {
    draw = false;

    let ctx = canvas.current?.getContext("2d");
    if (!ctx) return;

    let image = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    setImageData(image);
  };

  const move = (e: React.MouseEvent | React.TouchEvent) => {
    if (!draw) return;

    let ctx = canvas.current?.getContext("2d");
    if (!ctx) return;

    ctx.beginPath();
    ctx.lineWidth = ctx.canvas.width / 10;
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";
    ctx.moveTo(x!, y!);
    getPosition(e);
    ctx.lineTo(x!, y!);
    ctx.stroke();
  };

  const clear = () => {
    let ctx = canvas.current?.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  };

  return (
    <>
      <canvas
        className="border-2 border-black"
        ref={canvas}
        onMouseDown={start}
        onMouseUp={end}
        onMouseMove={move}
        onTouchStart={start}
        onTouchEnd={end}
        onTouchMove={move}
      />
      <button
        className="rounded border-2 border-black"
        onClick={() => {
          clear();
          setImageData(null);
        }}
      >
        Clear
      </button>
    </>
  );
};
