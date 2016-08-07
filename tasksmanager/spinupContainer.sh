sudo docker run -e "HOST=192.168.55.55" -e "MONGOPORT:7011" --name priority_taskmanager -p 7012:3000 -d priority_taskmanager:0.1
