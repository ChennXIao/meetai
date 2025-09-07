interface Props {
    children: React.ReactNode;
} 


const Layout = ({ children }: Props) => {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div className="w-full max-w-sm md:max-w-3xl">
                {children}
            </div>
        </div>
    </div>
  );
};

export default Layout;
