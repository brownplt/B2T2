# frozen_string_literal: true

require './cell'
require './ensure_exception'
require './require_exception'
require './row'
require './schema'
require './table'
require './type_extensions'

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
          table = described_class.new(schema: schema, rows: [row_a, row_b, row_c])
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
          table = described_class.new(schema: schema, rows: [row_a, row_b, row_c])
          expect(table.ncols).to eq(2)
        end
      end
    end

    describe '#header' do
      context 'when table empty' do
        it 'returns 0 column names' do
          table = described_class.empty_table
          expect(table.header).to eq([])
        end
      end

      context 'when table is non-empty' do
        it 'returns the names of columns' do
          table = described_class.new(schema: schema, rows: [row_a, row_b, row_c])
          expect(table.header).to eq(%w[header_a header_b])
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
          end.to raise_error ArgumentError
        end
      end

      context 'when input is a number outside bounds table rows' do
        it 'fails' do
          table = described_class.empty_table

          expect do
            table.get_row(0)
          end.to raise_error ArgumentError
        end
      end

      context 'when input is valid' do
        context 'when index is first row' do
          it 'returns row' do
            table = described_class.new(schema: schema, rows: [row_a, row_b, row_c])
            expect(table.get_row(0)).to eq(row_a)
          end
        end

        context 'when index is final row' do
          it 'returns row' do
            table = described_class.new(schema: schema, rows: [row_a, row_b, row_c])
            expect(table.get_row(2)).to eq(row_c)
          end
        end
      end
    end

    describe '#get_value' do
      context 'when input is not a string' do
        it 'fails' do
          table = described_class.empty_table

          expect do
            table.get_value(row_a, 1)
          end.to raise_error ArgumentError
        end
      end

      context 'when input column name not in row' do
        it 'fails' do
          table = described_class.new(schema: schema, rows: [row_a, row_b, row_c])

          expect do
            table.get_value(row_a, 'header_d')
          end.to raise_error RequireException
        end
      end

      context 'when input correct and sort correct' do
        it 'retrieves value' do
          table = described_class.new(schema: schema, rows: [row_a, row_b, row_c])
          value = table.get_value(row_c, 'header_a')

          expect(value).to eq(3)
        end

        it 'retrieves value' do
          table = described_class.new(schema: schema, rows: [row_a, row_b, row_c])
          value = table.get_value(row_a, 'header_b')

          expect(value).to be(true)
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
          table = described_class.new(schema: schema, rows: [row_a, row_b, row_c])

          expect do
            table.get_column_by_index(4)
          end.to raise_error RequireException
        end

        it 'fails' do
          table = described_class.new(schema: schema, rows: [row_a, row_b, row_c])

          expect do
            table.get_column_by_index(-1)
          end.to raise_error RequireException
        end
      end

      context 'when input correct and sort correct' do
        it 'returns first column' do
          table = described_class.new(schema: schema, rows: [row_a, row_b, row_c])
          column = table.get_column_by_index(0)

          expect(column).to eq([1, 2, 3])
        end

        it 'returns last column' do
          table = described_class.new(schema: schema, rows: [row_a, row_b, row_c])
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
          table = described_class.new(schema: schema, rows: [row_a, row_b, row_c])

          expect do
            table.get_column_by_name('header_d')
          end.to raise_error RequireException
        end
      end

      context 'when input correct and sort correct' do
        it 'returns first column' do
          table = described_class.new(schema: schema, rows: [row_a, row_b, row_c])
          column = table.get_column_by_name('header_a')

          expect(column).to eq([1, 2, 3])
        end

        it 'returns last column' do
          table = described_class.new(schema: schema, rows: [row_a, row_b, row_c])
          column = table.get_column_by_name('header_b')

          expect(column).to eq([true, true, false])
        end
      end
    end
  end
end
# rubocop:enable RSpec/NestedGroups
# rubocop:enable Metrics/BlockLength
