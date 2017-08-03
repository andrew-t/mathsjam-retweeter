if [ -d site ]
then
	cd site
	git pull
	cd ..
else
	git clone https://github.com/MathsJam/mathsjam-site.git site
fi

node rip-data.js