type LoaderProps = {
  loaderContent: string;
};

export default function Loader({ loaderContent }: LoaderProps) {
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-lg font-medium text-amber-600">{loaderContent}</p>
    </div>
  );
}
