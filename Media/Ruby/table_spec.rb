# frozen_string_literal: true

require './cell'
require './ensure_exception'
require './require_exception'
require './row'
require './schema'
require './table'

# rubocop:disable Metrics/BlockLength
RSpec.describe Table do
  describe 'properties' do
    let(:headers) do
      [
        { column_name: 'header_a', sort: 'number' },
        { column_name: 'header_b', sort: 'boolean' }
      ]
    end
    let(:schema) { Schema.new(headers: headers) }
    let(:row_a) { Row.new([Cell.new(1), Cell.new(true)]) }
    let(:row_b) { Row.new([Cell.new(2), Cell.new(true)]) }
    let(:row_c) { Row.new([Cell.new(3), Cell.new(false)]) }

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
end
# rubocop:enable RSpec/NestedGroups
# rubocop:enable Metrics/BlockLength
