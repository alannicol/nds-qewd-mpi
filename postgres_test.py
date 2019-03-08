#!/usr/bin/python

import psycopg2
try:
    db = psycopg2.connect("dbname='mpi' user='postgres' host='localhost' password='postgres'")
except:
	print "I am unable to connect to the database"

cur = db.cursor()
try:
    cur.execute("""SELECT * FROM mpi."Patient";""")
except:
    print "I can't find data!"

rows = cur.fetchall()
for row in rows:
    print "   ", row
exit(0)