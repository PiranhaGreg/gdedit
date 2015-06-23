CXX=tsc
CXXFLAGS=--removeComments --noImplicitAny --sourceMap

all: www/js/main.js

run: all
	xdg-open www/index.html

www/js/main.js: ts/main.ts ts/map.ts ts/levels.ts
	$(CXX) $(CXXFLAGS) --out $@ $< $(LIBS)

clean:
	rm www/js/main.js www/js/main.js.map
