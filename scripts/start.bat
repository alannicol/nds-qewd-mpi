SET QEWD_PATH=%1
SET SERVICE=%2
SET PORT=%3
docker run -it --name %SERVICE% --rm --net qewd-net -p %PORT%:8080 -v %QEWD_PATH%\nds-qewd-mpi:/opt/qewd/mapped -v %QEWD_PATH%\nds-qewd-mpi\yottadb\mpi_service:/root/.yottadb/r1.22_x86_64/g rtweed/qewd-server