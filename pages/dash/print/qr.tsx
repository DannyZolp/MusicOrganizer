import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { IPageProps } from "../../../types/interface/IPageProps";
import { definitions } from "../../../types/supabase";

const PrintQRCodes = ({ supabase }: IPageProps) => {
    const [QRCodes, setQRCodes] = useState<definitions["scores"][]>([]);

    // process qr codes
    useEffect(() => {
        const qrCodes = JSON.parse(window.localStorage.getItem("print_qrcodes") ?? "[]") as string[];
        supabase.from<definitions["scores"]>("scores").select("id, custom_id, name, description").in("id", qrCodes).then(({ data }) => {
            if (data) {
                setQRCodes(data);
                window.print();
                // the print dialogue has been triggered
                window.close();
            }
        })
    }, [])

    return (
        <div className="page qr">
            <div className="columns is-multiline">
                {QRCodes.map((qr, idx) => (
                    <div className="column is-flex is-4" key={idx}>
                        <QRCode value={`https://${window.location.host}/dash/score?check=${qr.id}`} size={75} />
                        <div className="ml-1 text">
                            <h1><code>ID-{qr.custom_id}</code></h1>
                            <h1><strong>{qr.name}</strong></h1>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default PrintQRCodes;