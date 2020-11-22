import React,{useState,useEffect} from 'react'
import MateriaTable from 'material-table'
 
export const Pagination = (props)=>{


const [students, setStudents] = useState([])


  useEffect(()=>{
         setStudents(props.students)
  },[props])

   const columns = [
    {title: 'Cedula', field: 'ci'},
    {title: 'Nombre', field: 'firstName'},
    {title: 'Apellido', field: 'lastName'},
    {title: 'Curso', field: 'school_year'},
  ]



const Options = {
  
            showTitle: false,
            selection: true,
            headerStyle: {
              backgroundColor: '#01579b',
              color: '#FFF'
            },

            searchFieldStyle: {
              alignContent: 'center',
              alignItems: 'center',
            },

            filterCellStyle: {
              color: '#FFF'
            }

          }

const Localization ={
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
              nRowsSelected: '{0} Estudiante(s) seleccionados',
              searchTooltip: 'Buscar',
              searchPlaceholder: 'Buscar Estudiante'
            },

            body: {
              emptyDataSourceMessage: props.errors,
              filterRow: {
                filterTooltip: 'Filter'
              }
            }
}

return(
  <React.Fragment>
    <MateriaTable
          data={students}
          columns={columns}
          onRowClick={((e, selectedRow) => props.view(selectedRow._id))}


          //Opciones Tabla
          options={Options}

          onSelectionChange={(rows) => props.selectedStudent(rows)}

          // Idioma Tabla
          localization={Localization}
        />
    </React.Fragment>
)
}
