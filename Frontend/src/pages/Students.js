import React from 'react'
import axios from 'axios'
import MateriaTable from 'material-table'
export default class Students extends React.Component {

        state = {
            students: [],
            ci: '',
            firstName: '',
            lastName: '',
            school_year: ''
        }

        handleInfo(id) {
            console.log(id)
            this.props.history.push('/StudentInfo/' + id);

        }

        //Actualiza los datos si se ha modificado la fila
        async handleRowUpdate(newData, oldData, resolve) {
            const data = newData
            let ci = data.ci
            let firstName = data.firstName
            let lastName = data.lastName
            let school_year = data.school_year
            console.log(data.firstName)
            await axios.post('http://localhost:8080/studentUpdate/' + data._id, { ci, firstName, lastName, school_year })
            const res = await axios.get('http://localhost:8080/students')
            this.setState({ students: res.data })
            resolve()

        }

        async UNSAFE_componentWillMount() {

            const res = await axios.get('http://localhost:8080/students')
            this.setState({ students: res.data })

        }



        render() {

                const columns = [
                    { title: 'Cedula', field: 'ci' },
                    { title: 'Nombre', field: 'firstName' },
                    { title: 'Apellido', field: 'lastName' },
                    { title: 'Curso', field: 'school_year' }

                ]



        return (
            <div>
			<h1 style={{textAlign:'center'}}>Lista de estudiantes</h1>
			<section className="tableMaterial">
				<MateriaTable 
				data={this.state.students}
				columns={columns}
				  onRowClick={((e, selectedRow) =>this.handleInfo(selectedRow._id))}

                  editable={{
                           onRowUpdate: (newData, oldData) =>
                           
                           
      new Promise((resolve) => {
        this.handleRowUpdate(newData, oldData, resolve);
  })
                  }}



//Opciones Tabla
  options={{
		pageSize:10,
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
}