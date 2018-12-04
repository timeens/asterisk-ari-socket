SSL Cert generation for wss TLS
openssl genrsa -des3 -out asterisk.key.encrypted 2048

openssl req -x509 -new -nodes -key asterisk.key.encrypted -sha256 -days 1825 -out asterisk.pem

openssl rsa -in asterisk.key.encrypted -out asterik.key