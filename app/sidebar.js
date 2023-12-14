export const SideElement = ({ header, contents }) => {
  return (
    <div className="h-32 w-32 text-card-color-matched flex flex-col rounded-full border-2 border-card-color-matched p-4 shadow-xl justify-center items-center">
      <div className="text-sm font-bold">{header}</div>
      <div className="text-2xl">{contents}</div>
    </div>
  );
};
