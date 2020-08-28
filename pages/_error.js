export default function Name(props){
    return (
        <>
            <style jsx>{`
                .con{
                    width: 100%;
                    height: 100%;
                    position: relative;
                }
                h1{
                    position: absolute;
                    transform: translate(-50%);
                    left: 50%;
                    top: 50%;
                }
            `}
            </style>
           <div className="con">
                <h1>this is custom error page</h1>
           </div>
        </>
    )
}