#!/bin/bash

# --- Configurações ---
NAMESPACE="grcx4to1vlrf"
BUCKET_NAME="theme2"
PASTA_LOCAL="/mnt/d/dev/Estudos/keen_html_v3.0.8-1/keen_html_v3.0.8/demo1/assets/css" # Use o caminho absoluto
PREFIXO_NO_BUCKET="css/" # Opcional: ex: "website/" para subir para uma "pasta" no bucket

# --- Lógica do Script ---
if [ ! -d "$PASTA_LOCAL" ]; then
    echo "Erro: O diretório '$PASTA_LOCAL' não foi encontrado."
    exit 1
fi

# Itera sobre todos os arquivos na pasta local e suas subpastas
find "$PASTA_LOCAL" -type f | while read ARQUIVO_COMPLETO; do
    # Extrai o caminho relativo do arquivo para usar como nome do objeto
    NOME_DO_OBJETO="${ARQUIVO_COMPLETO#$PASTA_LOCAL/}"

    # --- LÓGICA DE DEFINIÇÃO DO CONTENT-TYPE ---
    # Verifica a extensão do arquivo e define o Content-Type apropriado.
    if [[ "$NOME_DO_OBJETO" == *.css ]]; then
        CONTENT_TYPE="text/css"
    elif [[ "$NOME_DO_OBJETO" == *.js ]]; then
        CONTENT_TYPE="text/javascript"
    else
        # Para todos os outros arquivos, detecta o tipo MIME automaticamente
        CONTENT_TYPE=$(file --mime-type -b "$ARQUIVO_COMPLETO")
    fi
    # --- FIM DA LÓGICA DE DEFINIÇÃO ---

    # Adiciona o prefixo ao nome do objeto, se definido
    if [ -n "$PREFIXO_NO_BUCKET" ]; then
        NOME_DO_OBJETO="$PREFIXO_NO_BUCKET$NOME_DO_OBJETO"
    fi

    echo "Fazendo upload de '$NOME_DO_OBJETO' com Content-Type: $CONTENT_TYPE ..."

    # Executa o comando de upload para o arquivo individual
    oci os object put \
        --namespace "$NAMESPACE" \
        --bucket-name "$BUCKET_NAME" \
        --file "$ARQUIVO_COMPLETO" \
        --name "$NOME_DO_OBJETO" \
        --content-type "$CONTENT_TYPE" \
        --force # Use --force para sobrescrever arquivos existentes com o mesmo nome
done

echo "Upload concluído!"
