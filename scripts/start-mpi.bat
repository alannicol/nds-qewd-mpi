docker run -it --name master_patient_index --rm --net qewd-net -p 8085:8080 -v c:\Shared\Ripple\nds-mpi:/opt/qewd/mapped -v c:\Shared\Ripple\nds-mpi\yottadb\mpi_service:/root/.yottadb/r1.22_x86_64/g rtweed/qewd-server