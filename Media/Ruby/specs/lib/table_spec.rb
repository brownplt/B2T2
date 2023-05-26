# frozen_string_literal: true

require './lib/cell'
require './lib/ensure_exception'
require './lib/require_exception'
require './lib/row'
require './lib/schema'
require './lib/table'
require './lib/type_extensions'

# rubocop:disable RSpec/MultipleMemoizedHelpers
# rubocop:disable Metrics/BlockLength
RSpec.describe Table do
  let(:headers) do
    [
      { column_name: 'header_a', sort: Integer },
      { column_name: 'header_b', sort: Boolean }
    ]
  end
  let(:schema) { Schema.new(headers: headers) }
  let(:row_a) { Row.new(schema: schema, cells: [Cell.new('header_a', 1), Cell.new('header_b', true)]) }
  let(:row_b) { Row.new(schema: schema, cells: [Cell.new('header_a', 2), Cell.new('header_b', true)]) }
  let(:row_c) { Row.new(schema: schema, cells: [Cell.new('header_a', 3), Cell.new('header_b', false)]) }
  let(:rows) { [row_a, row_b, row_c] }

  let(:headers2) do
    [
      { column_name: 'header_c', sort: String }
    ]
  end
  let(:schema2) { Schema.new(headers: headers2) }
  let(:row_d) { Row.new(schema: schema2, cells: [Cell.new('header_c', 'a')]) }
  let(:row_e) { Row.new(schema: schema2, cells: [Cell.new('header_c', 'b')]) }
  let(:row_f) { Row.new(schema: schema2, cells: [Cell.new('header_c', 'c')]) }
  let(:rows2) { [row_d, row_e, row_f] }

  describe 'constructor' do
    describe '.empty_table' do
      context 'when table is empty' do
        it 'has no rows' do
          table = described_class.empty_table
          expect(table.rows).to eq([])
        end

        it 'has an empty schema' do
          table = described_class.empty_table
          expect(table.schema).to eq(Schema.new)
        end
      end
    end

    describe '.add_rows' do
      context 'when table is empty' do
        context 'when table schema does not match rows schema' do
          it 'fails the require' do
            table = described_class.empty_table
            expect { described_class.add_rows(table, rows) }.to raise_error(RequireException)
          end
        end

        context 'when schemas match' do
          it 'adds rows to the table' do
            table = described_class.empty_table
            new_table = described_class.add_rows(
              table,
              [
                Row.new(schema: Schema.new, cells: []),
                Row.new(schema: Schema.new, cells: []),
                Row.new(schema: Schema.new, cells: [])
              ]
            )
            expect(new_table.nrows).to eq(3)
          end
        end
      end

      context 'when table is non-empty' do
        context 'when table schema does not match rows schema' do
          it 'fails the require' do
            table = described_class.new(schema: schema, rows: rows)
            expect do
              described_class.add_rows(table, [Row.new(
                schema: Schema.new(headers: [{ column_name: 'header_a', sort: Integer }]),
                cells: [Cell.new('header_a', 1)]
              )])
            end.to raise_error(RequireException)
          end
        end

        context 'when schemas match' do
          it 'adds rows to the table' do
            table = described_class.new(schema: schema, rows: rows)
            new_table = described_class.add_rows(table, [
                                                   Row.new(
                                                     schema: schema,
                                                     cells: [Cell.new('header_a', 4), Cell.new('header_b', true)]
                                                   )
                                                 ])
            expect(new_table.nrows).to eq(4)
          end
        end
      end
    end

    describe '.add_column' do
      context 'when header is not unique' do
        it 'fails the require' do
          table = described_class.new(schema: schema, rows: rows)
          expect do
            described_class.add_column(table, { column_name: 'header_a', sort: Integer }, [1, 2, 3])
          end.to raise_error(RequireException)
        end
      end

      context 'when number of rows does not match number of values' do
        it 'fails the require' do
          table = described_class.new(schema: schema, rows: rows)
          expect do
            described_class.add_column(table, { column_name: 'header_d', sort: Integer }, [1, 2, 3, 4, 5, 6])
          end.to raise_error(RequireException)
        end
      end

      context 'when sort of row values does not match header' do
        it 'fails the require' do
          table = described_class.new(schema: schema, rows: rows)
          expect do
            described_class.add_column(table, { column_name: 'header_d', sort: Integer }, [1, false, 3])
          end.to raise_error(EnsureException)
        end
      end

      context 'when table is empty' do
        it 'adds column to the table' do
          table = described_class.empty_table
          new_table = described_class.add_column(table, { column_name: 'header_a', sort: Integer }, [])

          expect(table.ncols).to eq(0)
          expect(new_table.ncols).to eq(1)
        end
      end

      context 'when table is non-empty' do
        it 'adds column to the table' do
          table = described_class.new(schema: schema, rows: rows)
          new_table = described_class.add_column(table, { column_name: 'header_d', sort: Integer }, [1, 2, 3])

          expect(table.ncols).to eq(2)
          expect(new_table.ncols).to eq(3)
        end
      end
    end

    describe '.build_column' do
      context 'when header is not unique' do
        it 'fails the require' do
          table = described_class.new(schema: schema, rows: rows)
          expect do
            described_class.build_column(table, { column_name: 'header_a', sort: Integer }) { |_i| false }
          end.to raise_error(RequireException)
        end
      end

      context 'when sort of row values does not match header' do
        it 'fails the require' do
          table = described_class.new(schema: schema, rows: rows)
          expect do
            described_class.build_column(table, { column_name: 'header_d', sort: Integer }) { |_i| false }
          end.to raise_error(EnsureException)
        end
      end

      context 'when table is empty' do
        it 'adds column to the table' do
          table = described_class.empty_table
          new_table = described_class.build_column(table, { column_name: 'header_a', sort: Integer }) do |r|
            r.cells.size
          end

          expect(table.ncols).to eq(0)
          expect(new_table.ncols).to eq(1)
        end
      end

      context 'when table is non-empty' do
        it 'adds column to the table' do
          table = described_class.new(schema: schema, rows: rows)
          new_table = described_class.build_column(table, { column_name: 'header_d', sort: Integer }) do |r|
            r.cells.size
          end

          expect(table.ncols).to eq(2)
          expect(new_table.ncols).to eq(3)
        end
      end
    end

    describe '.vcat' do
      context 'when schemas of tables are not equal' do
        it 'fails the require' do
          table1 = described_class.new(schema: schema, rows: rows)
          table2 = described_class.empty_table

          expect do
            described_class.vcat(table1, table2)
          end.to raise_error(RequireException)
        end
      end

      context 'when table is empty' do
        it 'adds column to the table' do
          table1 = described_class.empty_table
          table2 = described_class.empty_table

          table3 = described_class.vcat(table1, table2)

          expect(table3.ncols).to eq(0)
          expect(table3.nrows).to eq(0)
        end
      end

      context 'when table is non-empty' do
        it 'adds column to the table' do
          table1 = described_class.new(schema: schema, rows: rows)
          table2 = described_class.new(schema: schema, rows: rows)

          table3 = described_class.vcat(table1, table2)

          expect(table3.ncols).to eq(2)
          expect(table3.nrows).to eq(6)
        end
      end
    end

    describe '.hcat' do
      context 'when a header is not unique' do
        it 'fails the require' do
          table1 = described_class.new(schema: schema, rows: rows)
          table2 = described_class.new(schema: schema, rows: rows)

          expect do
            described_class.hcat(table1, table2)
          end.to raise_error(RequireException)
        end
      end

      context 'when the number of rows is not equal' do
        it 'fails the require' do
          table1 = described_class.new(schema: schema, rows: rows)
          table2 = described_class.new(schema: schema2, rows: [row_d])

          expect do
            described_class.hcat(table1, table2)
          end.to raise_error(RequireException)
        end
      end

      context 'when both tables are empty' do
        it 'returns an empty table' do
          table1 = described_class.empty_table
          table2 = described_class.empty_table

          table3 = described_class.hcat(table1, table2)

          expect(table3.ncols).to eq(0)
          expect(table3.nrows).to eq(0)
        end
      end

      context 'when one table is empty' do
        context 'when table1 is empty' do
          it 'returns table2' do
            table1 = described_class.add_rows(
              described_class.empty_table,
              [
                Row.new(schema: Schema.new, cells: []),
                Row.new(schema: Schema.new, cells: []),
                Row.new(schema: Schema.new, cells: [])
              ]
            )

            table2 = described_class.new(schema: schema, rows: rows)

            table3 = described_class.hcat(table1, table2)

            expect(table3.ncols).to eq(2)
            expect(table3.nrows).to eq(3)
          end
        end

        context 'when table2 is empty' do
          it 'returns table1' do
            table1 = described_class.new(schema: schema, rows: rows)
            table2 = described_class.add_rows(
              described_class.empty_table,
              [
                Row.new(schema: Schema.new, cells: []),
                Row.new(schema: Schema.new, cells: []),
                Row.new(schema: Schema.new, cells: [])
              ]
            )

            table3 = described_class.hcat(table1, table2)

            expect(table3.ncols).to eq(2)
            expect(table3.nrows).to eq(3)
          end
        end
      end

      context 'when both tables are non-empty' do
        it 'returns a table with the columns of both tables' do
          table1 = described_class.new(schema: schema, rows: rows)
          table2 = described_class.new(schema: schema2, rows: rows2)

          table3 = described_class.hcat(table1, table2)

          expect(table3.ncols).to eq(3)
          expect(table3.nrows).to eq(3)
        end
      end
    end

    describe '.values' do
      context 'when rows do not have the same schema' do
        it 'fails the require' do
          expect do
            described_class.values([row_a, row_b, row_c, row_d])
          end.to raise_error(RequireException)
        end
      end

      context 'when rows have the same schema' do
        it 'returns a table with the rows' do
          table = described_class.values(rows)

          expect(table.ncols).to eq(2)
          expect(table.nrows).to eq(3)
        end

        it 'returns a table with the rows even when the row sequence is empty' do
          table = described_class.values([])

          expect(table.ncols).to eq(0)
          expect(table.nrows).to eq(0)
        end
      end
    end

    describe '.cross_join' do
      context 'when a header is not unique' do
        it 'fails the require' do
          table1 = described_class.new(schema: schema, rows: rows)
          table2 = described_class.new(schema: schema, rows: rows)

          expect do
            described_class.cross_join(table1, table2)
          end.to raise_error(RequireException)
        end
      end

      context 'when both tables are empty' do
        it 'returns an empty table' do
          table1 = described_class.empty_table
          table2 = described_class.empty_table

          table3 = described_class.cross_join(table1, table2)

          expect(table3.ncols).to eq(0)
          expect(table3.nrows).to eq(0)
        end
      end

      context 'when one table is empty' do
        context 'when table1 is empty' do
          it 'returns an empty table' do
            table1 = described_class.empty_table
            table2 = described_class.new(schema: schema, rows: rows)

            table3 = described_class.cross_join(table1, table2)

            expect(table3.ncols).to eq(2)
            expect(table3.nrows).to eq(0)
          end
        end

        context 'when table2 is empty' do
          it 'returns an empty table' do
            table1 = described_class.new(schema: schema, rows: rows)
            table2 = described_class.empty_table

            table3 = described_class.cross_join(table1, table2)

            expect(table3.ncols).to eq(2)
            expect(table3.nrows).to eq(0)
          end
        end
      end

      context 'when both tables are non-empty' do
        it 'returns a table with the rows of both tables' do
          table1 = described_class.new(schema: schema, rows: rows)
          table2 = described_class.new(schema: schema2, rows: rows2)

          table3 = described_class.cross_join(table1, table2)

          expect(table3.ncols).to eq(3)
          expect(table3.nrows).to eq(9)
        end
      end
    end
  end

  describe 'properties' do
    describe '#nrows' do
      context 'when table empty' do
        it 'returns 0 rows' do
          table = described_class.empty_table
          expect(table.nrows).to eq(0)
        end
      end

      context 'when table is non-empty' do
        it 'returns the number of rows' do
          table = described_class.new(schema: schema, rows: rows)
          expect(table.nrows).to eq(3)
        end
      end
    end

    describe '#ncols' do
      context 'when table empty' do
        it 'returns 0 columns' do
          table = described_class.empty_table
          expect(table.ncols).to eq(0)
        end
      end

      context 'when table is non-empty' do
        it 'returns the number of columns' do
          table = described_class.new(schema: schema, rows: rows)
          expect(table.ncols).to eq(2)
        end
      end
    end

    describe '#header' do
      context 'when table empty' do
        it 'returns 0 column names' do
          table = described_class.empty_table
          expect(table.schema.headers).to eq([])
        end
      end

      context 'when table is non-empty' do
        it 'returns the names of columns' do
          table = described_class.new(schema: schema, rows: rows)
          expect(table.schema.headers.map { |c| c[:column_name] }).to eq(%w[header_a header_b])
        end
      end
    end
  end

  describe 'Access Subcomponents' do
    describe '#get_row' do
      context 'when input is not a number' do
        it 'fails' do
          table = described_class.empty_table

          expect do
            table.get_row('a')
          end.to raise_error ArgumentError
        end
      end

      context 'when input is not a positive number' do
        it 'fails' do
          table = described_class.empty_table

          expect do
            table.get_row(-1)
          end.to raise_error RequireException
        end
      end

      context 'when input is a number outside bounds table rows' do
        it 'fails' do
          table = described_class.empty_table

          expect do
            table.get_row(0)
          end.to raise_error RequireException
        end
      end

      context 'when input is valid' do
        context 'when index is first row' do
          it 'returns row' do
            table = described_class.new(schema: schema, rows: rows)
            expect(table.get_row(0)).to eq(row_a)
          end
        end

        context 'when index is final row' do
          it 'returns row' do
            table = described_class.new(schema: schema, rows: rows)
            expect(table.get_row(2)).to eq(row_c)
          end
        end
      end
    end

    describe '#get_column_by_index' do
      context 'when input is not a number' do
        it 'fails' do
          table = described_class.empty_table

          expect do
            table.get_column_by_index('a')
          end.to raise_error ArgumentError
        end
      end

      context 'when input column name not in row' do
        it 'fails' do
          table = described_class.new(schema: schema, rows: rows)

          expect do
            table.get_column_by_index(4)
          end.to raise_error RequireException
        end

        it 'fails' do
          table = described_class.new(schema: schema, rows: rows)

          expect do
            table.get_column_by_index(-1)
          end.to raise_error RequireException
        end
      end

      context 'when input correct and sort correct' do
        it 'returns first column' do
          table = described_class.new(schema: schema, rows: rows)
          column = table.get_column_by_index(0)

          expect(column).to eq([1, 2, 3])
        end

        it 'returns last column' do
          table = described_class.new(schema: schema, rows: rows)
          column = table.get_column_by_index(1)

          expect(column).to eq([true, true, false])
        end
      end
    end

    describe '#get_column_by_name' do
      context 'when input is not a string' do
        it 'fails' do
          table = described_class.empty_table

          expect do
            table.get_column_by_name(1)
          end.to raise_error ArgumentError
        end
      end

      context 'when input column name not in row' do
        it 'fails' do
          table = described_class.new(schema: schema, rows: rows)

          expect do
            table.get_column_by_name('header_d')
          end.to raise_error RequireException
        end
      end

      context 'when input correct and sort correct' do
        it 'returns first column' do
          table = described_class.new(schema: schema, rows: rows)
          column = table.get_column_by_name('header_a')

          expect(column).to eq([1, 2, 3])
        end

        it 'returns last column' do
          table = described_class.new(schema: schema, rows: rows)
          column = table.get_column_by_name('header_b')

          expect(column).to eq([true, true, false])
        end
      end
    end
  end

  describe 'Subtable' do
    describe '.tfilter' do
      context 'when table is empty' do
        it 'returns empty table' do
          table = described_class.empty_table

          subtable = described_class.tfilter(table) { |row| row[0] == 1 }

          expect(subtable.nrows).to eq(0)
          expect(subtable.ncols).to eq(0)
        end
      end

      context 'when table is non-empty' do
        context 'when input is not filered' do
          it 'returns a non-empty table with a non-empty schema' do
            table = described_class.new(schema: schema, rows: rows)

            subtable = described_class.tfilter(table) { |_row| true }

            expect(subtable.nrows).to eq(3)
            expect(subtable.ncols).to eq(2)
          end
        end

        context 'when input is filtered' do
          it 'returns a non-empty table with a non-empty schema' do
            table = described_class.new(schema: schema, rows: rows)

            subtable = described_class.tfilter(table) { |row| row.cells.first.value != 1 }

            expect(subtable.nrows).to eq(2)
            expect(subtable.ncols).to eq(2)
          end
        end

        context 'when all input is filtered out' do
          it 'returns an empty table with a non-empty schema' do
            table = described_class.new(schema: schema, rows: rows)

            subtable = described_class.tfilter(table) { |_row| false }

            expect(subtable.nrows).to eq(0)
            expect(subtable.ncols).to eq(2)
          end
        end
      end
    end

    describe '.select_rows_by_indecies' do
      describe 'overload(1/2)' do
        context 'when index is not a number' do
          it 'fails the require' do
            table = described_class.empty_table

            expect do
              described_class.select_rows_by_indecies(table, ['a'])
            end.to raise_error RequireException
          end
        end

        context 'when index is not a positive number' do
          it 'fails the require' do
            table = described_class.empty_table

            expect do
              described_class.select_rows_by_indecies(table, [-1])
            end.to raise_error RequireException
          end
        end

        context 'when index is a number outside bounds table rows' do
          it 'fails the require' do
            table = described_class.empty_table

            expect do
              described_class.select_rows_by_indecies(table, [1])
            end.to raise_error RequireException
          end
        end

        context 'when indecies are not a sequence' do
          it 'fails the require' do
            table = described_class.empty_table

            expect do
              described_class.select_rows_by_indecies(table, 1)
            end.to raise_error RequireException
          end
        end

        context 'when index is valid' do
          context 'when index is first row' do
            it 'returns first row' do
              table = described_class.new(schema: schema, rows: rows)

              subtable = described_class.select_rows_by_indecies(table, [0])

              expect(subtable.nrows).to eq(1)
              expect(subtable.ncols).to eq(2)
              expect(subtable.get_row(0)).to eq(rows[0])
            end
          end

          context 'when index is final row' do
            it 'returns final row' do
              table = described_class.new(schema: schema, rows: rows)

              subtable = described_class.select_rows_by_indecies(table, [2])

              expect(subtable.nrows).to eq(1)
              expect(subtable.ncols).to eq(2)
              expect(subtable.get_row(0)).to eq(rows[2])
            end
          end

          context 'when index is middle row' do
            it 'returns middle row' do
              table = described_class.new(schema: schema, rows: rows)

              subtable = described_class.select_rows_by_indecies(table, [1])

              expect(subtable.nrows).to eq(1)
              expect(subtable.ncols).to eq(2)
              expect(subtable.get_row(0)).to eq(rows[1])
            end
          end

          context 'when index is multiple rows' do
            it 'returns multiple rows' do
              table = described_class.new(schema: schema, rows: rows)

              subtable = described_class.select_rows_by_indecies(table, [0, 2])

              expect(subtable.nrows).to eq(2)
              expect(subtable.ncols).to eq(2)
              expect(subtable.get_row(0)).to eq(rows[0])
              expect(subtable.get_row(1)).to eq(rows[2])
            end
          end
        end
      end

      describe 'overload(2/2)' do
        describe 'select_rows_by_indecies' do
          context 'when predicate is not a boolean' do
            it 'fails the require' do
              table = described_class.new(schema: schema, rows: rows)

              expect do
                described_class.select_rows_by_predicate(table, [0, true, false])
              end.to raise_error RequireException
            end
          end

          context 'when predicates is not a sequence' do
            it 'fails the require' do
              table = described_class.new(schema: schema, rows: rows)

              expect do
                described_class.select_rows_by_predicate(table, true)
              end.to raise_error RequireException
            end
          end

          context 'when predicates is not equal to table rows' do
            it 'fails the require' do
              table = described_class.new(schema: schema, rows: rows)

              expect do
                described_class.select_rows_by_predicate(table, [true, false])
              end.to raise_error RequireException
            end
          end

          context 'when predicates is equal to table rows' do
            context 'when predicate is all true' do
              it 'returns all rows' do
                table = described_class.new(schema: schema, rows: rows)

                subtable = described_class.select_rows_by_predicate(table, [true, true, true])

                expect(subtable.nrows).to eq(3)
                expect(subtable.ncols).to eq(2)
                expect(subtable.get_row(0)).to eq(rows[0])
                expect(subtable.get_row(1)).to eq(rows[1])
                expect(subtable.get_row(2)).to eq(rows[2])
              end
            end

            context 'when predicate is all false' do
              it 'returns no rows' do
                table = described_class.new(schema: schema, rows: rows)

                subtable = described_class.select_rows_by_predicate(table, [false, false, false])

                expect(subtable.nrows).to eq(0)
                expect(subtable.ncols).to eq(2)
              end
            end

            context 'when predicate is mixed' do
              it 'returns mixed rows' do
                table = described_class.new(schema: schema, rows: rows)

                subtable = described_class.select_rows_by_predicate(table, [true, false, true])

                expect(subtable.nrows).to eq(2)
                expect(subtable.ncols).to eq(2)
                expect(subtable.get_row(0)).to eq(rows[0])
                expect(subtable.get_row(1)).to eq(rows[2])
              end
            end

            context 'when table is empty' do
              it 'returns empty table' do
                table = described_class.empty_table

                subtable = described_class.select_rows_by_predicate(table, [])

                expect(subtable.nrows).to eq(0)
                expect(subtable.ncols).to eq(0)
              end
            end
          end
        end
      end
    end
  end

  describe 'Aggregate' do
    describe '.count' do
      context 'when column name is not a string' do
        it 'fails the require' do
          table = described_class.empty_table

          expect do
            described_class.count(table, 1)
          end.to raise_error RequireException
        end
      end

      context 'when column is not in the header' do
        it 'fails the require' do
          table = described_class.empty_table

          expect do
            described_class.count(table, 'foo')
          end.to raise_error RequireException
        end
      end

      context 'when column is in the header' do
        context 'when column is not empty' do
          it 'returns the count' do
            table = described_class.new(schema: schema, rows: rows + rows + rows + [rows[0]])

            result = described_class.count(table, 'header_a')

            # TODO: find a cleaner way to write this test
            expect(result.get_column_by_name('count')).to eq([4, 3, 3])
          end
        end
      end
    end
  end
end
# rubocop:enable RSpec/MultipleMemoizedHelpers
# rubocop:enable RSpec/NestedGroups
# rubocop:enable Metrics/BlockLength
