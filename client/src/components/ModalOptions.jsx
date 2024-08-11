import style from "./ModalOptions.module.css";

const ModalOptions = ({ onChoice }) => {
    console.log("descartavel: ");
    return (
        <div className={style.modal}>
            <div className={style.modal_content}>
                <h2>Escolha local do descarte</h2>
                <div className={style.options}>
                    <button onClick={() => onChoice("Descarte geral")}>
                        Descarte geral
                    </button>
                    <button onClick={() => onChoice("Próprio campo")}>
                        Próprio campo
                    </button>
                    <button onClick={() => onChoice("Campo adversário")}>
                        Campo adversário
                    </button>
                </div>
                <button onClick={() => onChoice("Cancelar")}>CANCELAR</button>
            </div>
        </div>
    );
};

/*

 */
export default ModalOptions;
