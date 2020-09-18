import React, { useState,useEffect } from 'react'
import axios from 'axios'
import MateriaTable from 'material-table'

async function request(){
     const res = await axios.get('http://localhost:8080/students')
     return res
}


 function handleInfo(id,props) {
            props.history.push('/StudentInfo/' + id);
        }

const Students = (props) =>{
      const [students,setStudents] = useState([])



        useEffect(() => {
             async function loadStudents(){
               const res = await request()
               setStudents(res.data)
               console.log(res)
             }
             loadStudents()
         }, []) 

           

       
                const columns = [
                    { title: 'Cedula', field: 'ci' },
                    { title: 'Nombre', field: 'firstName' },
                    { title: 'Apellido', field: 'lastName' },
                    { title: 'Curso', field: 'school_year' },
                ]



        return (
            <div>
			<h1 style={{textAlign:'center'}}>Lista de estudiantes</h1>
			<section className="tableMaterial">
				<MateriaTable 
				data={students}
				columns={columns}
				onRowClick={((e, selectedRow) =>handleInfo(selectedRow._id,props))}


//Opciones Tabla
  options={{
		showTitle:false,
		headerStyle: {
          backgroundColor: '#01579b',
          color: '#FFF'
        },

       searchFieldStyle:{
       	alignContent:'center',
       	alignItems:'center',
       },

			
        
        filterCellStyle:{
        	color:'#FFF'
        }

  }}

   // Idioma Tabla
    localization={{
        pagination: {
            labelDisplayedRows: '{from}-{to} de {count}',
            firstAriaLabel: 'Primera Pagina',
                    firstTooltip: 'Primera Pagina',
           	        previousAriaLabel: 'Pagina anterior',
                    previousTooltip: 'Pagina Anterior',
                    nextAriaLabel: 'Pagina Siguiente',
                    nextTooltip: 'Pagina Siguiente',
                    lastAriaLabel: 'Ultima Pagina',
                    lastTooltip: 'Ultima Pagina',
                    labelRowsSelect: 'Filas'
        },
        toolbar: {
            nRowsSelected: '{0} fila(s) seleccionadas',
            searchTooltip:'Buscar',
            searchPlaceholder:'Buscar Estudiante'
        },
        
        body: {
            emptyDataSourceMessage: 'No se encontraron estudiante',
            filterRow: {
                filterTooltip: 'Filter'
            }
        }


    }}
				/>
				</section>
			</div>
        )
    
}

export default Students