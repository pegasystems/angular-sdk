import { readdirSync, readFileSync, writeFileSync } from 'fs';
import brot from 'brotli';
import compressing from 'compressing';


const brotOptions = {
    extension: 'br',
    skipLarger: true,
    mode: 1, 
    quality: 10, 
    lgwin: 12, 
    threshold: 10240
};



var arFileList = [];

console.log("\n compress files")

// brotli compress all the assets in dist
// all will end in ".br".  Don't change the names of the files in 
// lib-assets.json, server will pick the .br files if they exist
readdirSync('dist/').forEach(file => {
    if (file.endsWith('.js') || file.endsWith('.css') || file.endsWith('.html')) {
        const result = brot.compress(readFileSync('dist/' + file), brotOptions);
        writeFileSync('dist/' + file + '.br', result);
        console.log('\tbrotli dist/' + file + '.br');

        
    }

    if (file.endsWith('.js') || file.endsWith('.css') || file.endsWith('.html')) {
        compressing.gzip.compressFile(readFileSync('dist/' + file), 'dist/' + file + '.gz')
        .then( () => {
            console.log('\tgzip dist/' + file + '.gz');
        });
        //writeFileSync('dist/' + file + '.gz', result);
        

        
    }

});





