SSL Cert generation for wss TLS

adjust config file from cert folder

openssl req -config cert.conf -new -sha256 -newkey rsa:2048 \
-nodes -keyout socket.asterisk.immosky.com.key -x509 -days 365 \
-out socket.asterisk.immosky.com.crt


