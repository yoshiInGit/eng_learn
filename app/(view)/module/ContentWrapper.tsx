type Props = {
    children?: React.ReactNode;
};

const ContentWrapper:  React.FC<Props> = ({children}) => {
    return (
    <div className="min-h-screen bg-gray-200 flex justify-center items-center">
      <div className="relative flex flex-col bg-gray-50 w-full max-w-md h-screen shadow-lg overflow-hidden">
        {children}
      </div>
    </div>
    );
    } 
export default ContentWrapper;