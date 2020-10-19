onload = function(){
    const editor = document.getElementById("editor");
    const context = editor.getContext("2d");
    const toolbar = document.getElementById("tool-bar");

    let upload_btn = document.getElementById("upload");
    let save_btn = document.getElementById("save");
    let flip_hor_btn = document.getElementById("flip-hor");
    let flip_ver_btn = document.getElementById("flip-ver");
    let rotate_r_btn = document.getElementById("rotate-right");
    let rotate_l_btn = document.getElementById("rotate-left");
    let grayscale_btn = document.getElementById("grayscale");

    function upload_file(){
        console.log("Inside upload fn . . .");
        let upload = document.createElement('input');
        upload.type = "file";
        upload.click();
        upload.onchange = function () {
            const img = new Image();
            img.onload = () =>{
                context.clearRect(0, 0, editor.width, editor.height);
                editor.width = img.width;
                editor.height = img.height;
                context.drawImage(img, 0, 0);
            }
            img.onerror = ()=>{
                context.clearRect(0, 0, editor.width, editor.height);
                context.font = "15pt";
                context.fillText("File couldn't be loaded as an image media", editor.width/4, editor.height/4);
                console.error("File couldn't be loaded as an image media");
            }
            img.src = URL.createObjectURL(this.files[0]);
        }
    }

    function save_file(){
        console.log("Inside save_file fn . . .");
        let image = editor.toDataURL('image/jpeg');
        let file = document.createElement('a');
        let name = document.getElementById('file-name');

        file.download = name.value;
        if(!file.download){
            file.download = 'image';
        }
        file.download += '.jpeg';
        file.href = image;
        file.click();
    }

    function flip_hor(){
        console.log("Inside flip_horizontal fn . . .");
        let cols = editor.width;
        let rows = editor.height;
        let image = get_3D_Array(rows, cols);
        for(let i=0; i<Math.floor(rows/2); i++){
            for(let j=0; j<cols; j++){
                let temp = image[i][j]; //4 pixels
                image[i][j] = image[rows-1-i][j];
                image[rows-1-i][j] = temp;
            }
        }
        set_Image_on_Canvas(image, rows, cols);
    }
    function flip_ver() {
        console.log("Inside flip_vertical fn . . .");
        let cols = editor.width;
        let rows = editor.height;
        let image = get_3D_Array(rows, cols);
        for(let i=0; i<rows; i++){
            for(let j=0; j<Math.floor(cols/2); j++){
                let temp = image[i][j];
                image[i][j] = image[i][cols-j-1];
                image[i][cols-j-1] = temp;
            }
        }
        set_Image_on_Canvas(image, rows, cols);
    }

    function rotate_right() {
        console.log("Inside rotate_right fn . . .");
        let cols = editor.width;
        let rows = editor.height;
        let image = get_3D_Array(rows, cols);
        let rotated = [];
        for(let i=0; i<cols; i++){
            let row = [];
            for(let j=rows-1; j>=0; j--){
                row.push(image[j][i]);
            }
            rotated.push(row);
        }
        set_Image_on_Canvas(rotated, cols, rows);
    }
    function rotate_left(){
        console.log("Inside rotate_left fn . . .");
        let cols = editor.width;
        let rows = editor.height;
        let image = get_3D_Array(rows, cols);
        let rotated = [];
        for(let i=cols-1; i>=0; i--){
            let row = [];
            for(let j=0; j<rows; j++){
                row.push(image[j][i]);
            }
            rotated.push(row);
        }
        set_Image_on_Canvas(rotated, cols, rows);
    }

    function convert_grayscale() {
        console.log("Inside grayscale fn . . .");
        let cols = editor.width;
        let rows = editor.height;
        let image = get_3D_Array(rows, cols);

        for(let i=0; i<rows; i++){
            for(let j=0; j<cols; j++){
                let pixel = image[i][j];
                let gray_value = Math.floor(0.3*pixel[0] + 0.59*pixel[1] + 0.11*pixel[2]);
                image[i][j][0] = image[i][j][1] = image[i][j][2] = gray_value;
            }
        }
        set_Image_on_Canvas(image, rows, cols);
    }

    upload_btn.onclick = function (e){
        e.preventDefault();
        upload_file(this);
    }
    save_btn.onclick = function (e){
        e.preventDefault();
        save_file(this);
    }
    flip_hor_btn.onclick = function (e){
        e.preventDefault();
        flip_hor();
    }
    flip_ver_btn.onclick = function (e){
        e.preventDefault();
        flip_ver();
    }
    rotate_r_btn.onclick = function (e){
        e.preventDefault();
        rotate_right();
    }
    rotate_l_btn.onclick = function (e){
        e.preventDefault();
        rotate_left();
    }
    grayscale_btn.onclick = function (e){
        e.preventDefault();
        convert_grayscale();
    }

    //converting 1D image data from extracted from canvas, to 3D image
    function get_3D_Array(rows, cols){
        let data = context.getImageData(0,0, cols, rows).data;
        let rgb_image = [];
        for(let i=0; i<rows; i++){
            let row = [];
            for(let j=0; j<cols; j++){
                let pixels = [];
                for(let k=0; k<4; k++){
                    pixels.push(data[(i*cols + j)*4 + k]);
                }
                row.push(pixels);
            }
            rgb_image.push(row);
        }
        return rgb_image;
    }
    //fn to convert 3d image array back to 1d and set it up on canvas
    function set_Image_on_Canvas(data, rows, cols){
        let image = Array.from({length: rows*cols*4});
        for(let i=0; i<rows; i++){
            for(let j=0; j<cols; j++){
                for(let k=0; k<4; k++){
                    image[(i*cols + j)*4 + k] = data[i][j][k];
                }
            }
        }
        context.clearRect(0, 0, editor.width, editor.height);
        let image_data = context.createImageData(cols, rows);
        image_data.data.set(image);
        editor.width = cols;
        editor.height = rows;
        context.putImageData(image_data, 0, 0);
    }
};

