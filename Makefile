CXX=tsc
CXXFLAGS=--removeComments --noImplicitAny --sourceMap

all: main.js

run: all
	xdg-open www/index.html

main.js: ts/main.ts
	$(CXX) $(CXXFLAGS) --out www/js/$@ $< $(LIBS)

clean:
	rm www/js/main.js www/js/main.js.map
