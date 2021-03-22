import React,{useState,useEffect} from 'react'





const CarrouselImages = () =>{
  const [imagesC,setImages] = useState()
  const [imagesNameAll,setImagesName] = useState([])

  useEffect(()=>{
    let imagesName = []
    function importAll(r) {
  let images = {};
  r.keys().map((item, index) => { imagesName.push(item.replace('./','')); return(images[item.replace('./', '')] = r(item)) });
  return images;
}

const images = importAll(require.context('../static/img', false, /\.(png|jpe?g|svg)$/));

setImages(images)
setImagesName(imagesName)


  },[])
	


return (

    <React.Fragment>
    
    {imagesNameAll.map((el,i)=>{

    	return(
          <img key={i} data-id={i} src={imagesC[`${el}`].default} alt={el}/>
    		)
    })}

    </React.Fragment>
 
	)
    	}
         

export default CarrouselImages
