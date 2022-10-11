export interface FileInterface {
    file: File;
}

export interface File {
    name: string;
    data: Data;
    size: number;
    encoding: string;
    tempFilePath: string;
    truncated: boolean;
    mimetype: string;
    md5: string;
}

export interface Data {
    type: string;
    data: any[];
}
