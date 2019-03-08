docker run --name master_patient_index --rm -p 8005:8080 -v c:\Shared\Ripple\nds-mpi\:/opt/qewd/mapped rtweed/qewd-server

docker logs -f master_patient_index