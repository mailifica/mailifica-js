/**
 * Marcação por tags para métricas e categorização
 */
export interface Tag {
  name: string;
  value: string;
}

/**
 * Anexo de email via Buffer binário, base64 ou URL remota
 */
export interface Attachment {
  /**
   * Conteúdo do anexo em Buffer binário ou String Base64
   */
  content?: Buffer | string;
  /**
   * Nome do ficheiro que aparecerá no cliente de email (Ex: fatura.pdf)
   */
  filename: string;
  /**
   * Caminho para ficheiro local ou URL remota
   */
  path?: string;
  /**
   * MIME Type opcional (Ex: application/pdf, image/png)
   */
  contentType?: string;
}

/**
 * Cabeçalhos HTTP adicionais
 */
export type Headers = Record<string, string>;
