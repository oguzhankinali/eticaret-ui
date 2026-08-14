import { HttpClientService } from "@/services/httpclient.service";
import { useState, useRef } from "react";
const httpClientService: HttpClientService = new HttpClientService();
export interface FileUploadOptions {
    controller: string;
    action?: string;
    queryString?: string;
    explanation?: string;
    accept?: string;
}

interface FileUploadProps {
    options: FileUploadOptions;
}
export default function FileUpload({ options }: FileUploadProps) {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedFiles(Array.from(e.target.files));
        }
    }
    const uploadFiles = async () => {
        if (selectedFiles.length === 0) return;
        const fileData: FormData = new FormData();
        selectedFiles.forEach(file => {
            fileData.append(file.name, file, file.name);
        })
        await httpClientService.post({
            controller: options.controller,
            action: options.action,
            queryString: options.queryString
        }, fileData);
        setSelectedFiles([]);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }

    return (
        <div>
            {options.explanation && <p style={{ fontWeight: "bold", marginBottom: "8px", color: "#333" }}>{options.explanation}</p>}
            <input ref={fileInputRef} type="file" multiple accept={options.accept} onChange={handleFileChange} />
            {selectedFiles.length > 0 && (
                <>
                    <ul>
                        {selectedFiles.map((file, index) =>
                            <li key={index}>{file.name} - {(file.size / 1024).toFixed(2)} KB</li>)
                        }
                    </ul>
                    <button onClick={uploadFiles}>Dosyaları Yükle</button>
                </>
            )}
        </div>

    )
}