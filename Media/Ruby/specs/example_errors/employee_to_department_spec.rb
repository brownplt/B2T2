# frozen_string_literal: true

require './lib/basics'
require './lib/schema'
require './lib/table'
require './lib/table_encoder'
require './lib/type_extensions'
require './specs/example_errors/error_helpers'

# rubocop:disable RSpec/DescribeClass

# gradebook: a simple table with no values missing
RSpec.describe 'mid final' do
  include Basics

  describe 'handles error as expected' do
    let(:employees) do
      TableEncoder.encode(
        "
      # | Last Name    | Department ID |
      # | ------------ | ------------- |
      # | \"Rafferty\"   | 31            |
      # | \"Jones\"      | 32            |
      # | \"Heisenberg\" | 33            |
      # | \"Robinson\"   | 34            |
      # | \"Smith\"      | 34            |
      # | \"Williams\"   |               |
      "
      )
    end

    let(:departments) do
      TableEncoder.encode(
        "
      # | Department ID | Department Name |
      # | ------------- | --------------- |
      # | 31            | \"Sales\"         |
      # | 33            | \"Engineering\"   |
      # | 34            | \"Clerical\"      |
      # | 35            | \"Marketing\"     |
      "
      )
    end

    context 'when happy path' do
      context 'when correct program' do
        # > deptIdToDeptName =
        #     function(deptTab, deptId):
        #       matchName =
        #         function(r):
        #           getValue(r, "Department ID") == deptId
        #         end
        #       matchedTab = tfilter(deptTab, matchName)
        #       matchedRow = getRow(matchedTab, 0)
        #       getValue(matchedRow, "Department Name")
        #     end
        # > employeeToDepartment =
        #     function(name, emplTab, deptTab):
        #       matchName =
        #         function(r):
        #           getValue(r, "Last Name") == name
        #         end
        #       matchedTab = tfilter(emplTab, matchName)
        #       matchedRow = getRow(matchedTab, 0)
        #       deptId = getValue(matchedRow, "Department ID")
        #       deptIdToDeptName(deptTab, deptId)
        #     end
        let(:dept_id_to_dept_name) do
          lambda do |dept_tab, dept_id|
            match_name = lambda do |r|
              get_value(r, 'Department ID') == dept_id
            end

            matched_tab = Table.tfilter(dept_tab) do |r|
              match_name.call(r)
            end

            matched_row = matched_tab.get_row(0)

            get_value(matched_row, 'Department Name')
          end
        end

        let(:employee_to_department) do
          lambda do |name, empl_tab, dept_tab|
            match_name = lambda do |r|
              get_value(r, 'Last Name') == name
            end

            matched_tab = Table.tfilter(empl_tab) do |r|
              match_name.call(r)
            end

            matched_row = matched_tab.get_row(0)

            dept_id = get_value(matched_row, 'Department ID')

            dept_id_to_dept_name.call(dept_tab, dept_id)
          end
        end

        it 'returns the correct department name for an employee' do
          result = employee_to_department.call(
            '"Heisenberg"',
            employees,
            departments
          )
          expect(result).to eq('"Engineering"')
        end
      end
    end

    context 'when buggy program' do
      # > lastNameToDeptId =
      #     function(deptTab, name):
      #       matchName =
      #         function(r):
      #           getValue(r, "Last Name") == name
      #         end
      #       matchedTab = tfilter(deptTab, matchName)
      #       matchedRow = getRow(matchedTab, 0)
      #       getValue(matchedRow, "Department ID")
      #     end
      # > employeeToDepartment =
      #     function(name, emplTab, deptTab):
      #       buildColumn(emplTab, "Department Name",
      #         function(r):
      #           lastNameToDeptId(deptTab, getValue(r, "Last Name"))
      #         end)
      #     end
      let(:last_name_to_dept_id) do
        lambda do |dept_tab, name|
          match_name = lambda do |r|
            get_value(r, 'Last Name') == name
          end

          matched_tab = Table.tfilter(dept_tab) do |r|
            match_name.call(r)
          end

          matched_row = matched_tab.get_row(0)

          get_value(matched_row, 'Department ID')
        end
      end

      let(:employee_to_department) do
        lambda do |_name, empl_tab, dept_tab|
          Table.build_column(empl_tab, { column_name: 'Department Name', sort: String }) do |r|
            last_name_to_dept_id.call(dept_tab, get_value(r, 'Last Name'))
          end
        end
      end

      it 'raises an error' do
        expect do
          employee_to_department.call(
            '"Heisenberg"',
            employees,
            departments
          )
        end.to raise_error(RequireException)
      end
    end
  end
end
# rubocop:enable RSpec/DescribeClass
