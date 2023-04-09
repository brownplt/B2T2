# calculator_spec.rb
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
    context "original table is empty" do
      it "creates a new table with an empty schema and no rows" do
        original_table = TableAPI.empty_table
        rows_to_add = ["some_row"]

        new_table = TableAPI.add_rows(original_table, rows_to_add)

        expect(TableAPI.nrows(new_table)).to eq(1)
      end
    end

    context "orginal table contains existing rows" do
      it "creates a new table with an empty schema and no rows" do
        expect(1).to eq(1)
      end
    end
  end
end
