require './row'
require './schema'
require './table_api'

RSpec.describe TableAPI do
  describe ".empty_table" do
    it "creates a table with an empty schema and no rows" do
      table = TableAPI.empty_table

      expect(TableAPI.schema(table)).to eq([])
      expect(TableAPI.nrows(table)).to eq(0)
    end
  end

  describe ".add_rows" do
    let(:headers) { ["header_a", "header_b"]}

    let(:schema) { Schema.new(headers)}
    let(:row_a) { Row.new(schema, [1, true])}
    let(:row_b) { Row.new(schema, [2, true])}
    let(:row_c) { Row.new(schema, [3, false])}

    context "orginal table contains existing rows" do
      context "it adds a row" do
        it "creating a new table with two rows" do
          original_table = Table.new(schema: schema, rows: [row_a])
          rows_to_add = [row_b, row_c]
  
          new_table = TableAPI.add_rows(original_table, rows_to_add)
  
          expect(TableAPI.nrows(new_table)).to eq(3)
        end
      end

      context "it adds no rows, an empty sequence" do
        it "creating a new table with one rows" do
          original_table = Table.new(rows: [row_a, row_b])
          rows_to_add = []
  
          new_table = TableAPI.add_rows(original_table, rows_to_add)
  
          expect(TableAPI.nrows(new_table)).to eq(2)
        end
      end
    end
  end
end
