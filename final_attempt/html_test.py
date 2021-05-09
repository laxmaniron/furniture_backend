import codecs


f = codecs.open(
    "./final_attempt/html_files/table-desk-systems-47423.html", 'r')
total_file = f.read()

terminator = total_file.find("noscript class=noscript-compact-fragments")

print(total_file[:terminator-1])

Html_file = open(
    "./final_attempt/html_files/table-desk-systems-47423.html", "w")
Html_file.write(total_file[:terminator-1])
Html_file.close()
